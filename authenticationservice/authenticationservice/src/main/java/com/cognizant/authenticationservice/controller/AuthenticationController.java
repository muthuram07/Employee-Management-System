package com.cognizant.authenticationservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cognizant.authenticationservice.dto.AuthenticationRequestDto;
import com.cognizant.authenticationservice.dto.AuthenticationResponseDTO;
import com.cognizant.authenticationservice.dto.EmployeeDto;
import com.cognizant.authenticationservice.feignclient.EmployeeFeignClient;
import com.cognizant.authenticationservice.service.AuthenticationService;
import com.cognizant.authenticationservice.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:3000") // Allows frontend connection from React
public class AuthenticationController {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    EmployeeFeignClient employeeFeignClient;

    @Autowired
    AuthenticationService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Handles employee registration.
     * Only users with 'MANAGER' role can register new employees.
     *
     * @param employee Employee details
     * @return ResponseEntity with registered employee or error message
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('MANAGER')") // Restricts access to managers
    public ResponseEntity<?> register(@Valid @RequestBody EmployeeDto employee) {
        log.info("[AUTHENTICATION-CONTROLLER] Registering new employee: {}", employee.getUsername());
        try {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            ResponseEntity<EmployeeDto> response = employeeFeignClient.register(employee);

            if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.warn("[AUTHENTICATION-CONTROLLER] Employee or Shift not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee or Shift not found.");
            }

            log.info("[AUTHENTICATION-CONTROLLER] Successfully registered employee: {}", employee.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response.getBody());

        } catch (Exception e) {
            log.error("[AUTHENTICATION-CONTROLLER] Error registering employee: {}. Error: {}", employee.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    /**
     * Handles user login authentication.
     *
     * @param request Contains username and password
     * @return ResponseEntity with JWT token or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequestDto request) {
        log.info("[AUTHENTICATION-CONTROLLER] Attempting login for username: {}", request.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

            String token = jwtUtil.generateToken(userDetails.getUsername(), role);
            log.info("[AUTHENTICATION-CONTROLLER] Login successful for username: {}", request.getUsername());

            return ResponseEntity.ok(new AuthenticationResponseDTO(token));
        } catch (BadCredentialsException ex) {
            log.warn("[AUTHENTICATION-CONTROLLER] Invalid login attempt for username: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        } catch (AuthenticationException ex) {
            log.error("[AUTHENTICATION-CONTROLLER] Authentication failed for username: {}. Error: {}", request.getUsername(), ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication failed: " + ex.getMessage());
        } catch (Exception e) {
            log.error("[AUTHENTICATION-CONTROLLER] Unexpected error during login for username: {}. Error: {}", request.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
