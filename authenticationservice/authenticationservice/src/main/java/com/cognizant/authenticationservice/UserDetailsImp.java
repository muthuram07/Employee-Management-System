package com.cognizant.authenticationservice;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.cognizant.authenticationservice.dto.EmployeeDto;
import com.cognizant.authenticationservice.feignclient.EmployeeFeignClient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class UserDetailsImp implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserDetailsImp.class);

    @Autowired
    private EmployeeFeignClient employeeFeignClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("[EMPLOYEE-SERVICE] Loading user by username: {}", username);

        try {
            EmployeeDto employee = Optional.ofNullable(employeeFeignClient.findByUsername(username).getBody())
                .orElseThrow(() -> {
                    log.warn("[EMPLOYEE-SERVICE] User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

            log.info("[EMPLOYEE-SERVICE] Successfully loaded user with username: {}", username);

            return new org.springframework.security.core.userdetails.User(
                employee.getUsername(),
                employee.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(employee.getRole()))
            );

        } catch (Exception e) {
            log.error("[EMPLOYEE-SERVICE] Error loading user by username: {}. Error: {}", username, e.getMessage(), e);
            throw e;
        }
    }
}
