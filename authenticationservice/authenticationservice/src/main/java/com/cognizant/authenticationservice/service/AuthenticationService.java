package com.cognizant.authenticationservice.service;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cognizant.authenticationservice.dto.EmployeeDto;
import com.cognizant.authenticationservice.feignclient.EmployeeFeignClient;

/**
 * Service class responsible for handling authentication-related operations.
 * Provides functionality for saving employee details securely.
 */
@Service
public class AuthenticationService {

    // Logger for debugging and monitoring service execution
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    // Injecting dependencies
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmployeeFeignClient employeeFeignClient;

    /**
     * Saves the employee details securely by encoding the password
     * and registering the employee using the Employee Management Service.
     *
     * @param employeeDto Employee details to be registered.
     * @return Registered EmployeeDto object with saved details.
     */
    public EmployeeDto save(EmployeeDto employeeDto) {
        log.info("Executing save method for EmployeeDto: {}", employeeDto);

        try {
            // Encode password before saving the employee details
            log.debug("Encoding password for employee: {}", employeeDto.getUsername());
            employeeDto.setPassword(passwordEncoder.encode(employeeDto.getPassword()));

            // Send request to Employee Management Service via Feign Client
            log.info("Calling EmployeeFeignClient to register employee.");
            EmployeeDto savedEmployee = employeeFeignClient.register(employeeDto).getBody();

            // Log successful registration
            log.info("Employee successfully registered: {}", savedEmployee);
            return savedEmployee;
        } catch (Exception e) {
            log.error("Error occurred while saving employee: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save employee", e);
        }
    }
}
