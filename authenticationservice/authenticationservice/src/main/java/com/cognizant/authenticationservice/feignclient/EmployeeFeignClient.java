package com.cognizant.authenticationservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import com.cognizant.authenticationservice.dto.EmployeeDto;

import jakarta.validation.Valid;

/**
 * Feign Client for interacting with Employee Management Microservice.
 * Enables seamless communication between Authentication Service and Employee Management.
 */
@FeignClient(name="employeemanagement", url="http://localhost:9090") // ✅ Specifies service name & base URL
public interface EmployeeFeignClient {

    /**
     * Registers a new employee in Employee Management Service.
     * 
     * @param employee The employee data to be saved.
     * @return ResponseEntity with the registered employee information.
     */
    @PostMapping("/api/employee/register-employee")
    public ResponseEntity<EmployeeDto> register(@Valid @RequestBody EmployeeDto employee);

    /**
     * Retrieves employee details by username from Employee Management Service.
     * 
     * @param username The unique username of the employee.
     * @return ResponseEntity containing the employee details if found.
     */
    @GetMapping("/api/employee/employee-username/{username}")
    public ResponseEntity<EmployeeDto> findByUsername(@PathVariable String username);
}
