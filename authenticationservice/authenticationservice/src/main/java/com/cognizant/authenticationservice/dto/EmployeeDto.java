package com.cognizant.authenticationservice.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmployeeDto {
	@NotNull(message = "Employee ID cannot be null")
	@Min(value = 1, message = "Employee ID must be greater than zero")
	private int employeeId;

	@NotNull(message = "Manager ID cannot be null")
	@Min(value = 1, message = "Manager ID must be greater than zero")
	private int managerId;

	@NotNull(message = "Username cannot be null")
	@Size(min = 2, max = 50, message = "Username must be between 2 and 50 characters")
	private String username;

	@NotNull(message = "Password cannot be null")
	@Size(min = 8, message = "Password must be at least 8 characters")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
	private String password;

	@NotNull(message = "First Name cannot be null")
	@Size(min = 2, max = 50, message = "First Name must be between 2 and 50 characters")
	private String firstName;

	@NotNull(message = "Last Name cannot be null")
	@Size(min = 2, max = 50, message = "Last Name must be between 2 and 50 characters")
	private String lastName;

	@NotNull(message = "Email cannot be null")
	@Email(message = "Email should be valid")
	private String email;

	@NotNull(message = "Phone Number cannot be null")
	@Pattern(regexp = "^\\d{10}$", message = "Phone number should be 10 digits")
	private String phoneNumber;

	@NotNull(message = "Department cannot be null")
	@Size(min = 2, max = 50, message = "Department must be between 2 and 50 characters")
	private String department;

	@NotNull(message = "Role cannot be null")
	@Size(min = 2, max = 50, message = "Role must be between 2 and 50 characters")
	private String role;

public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}

	public int getManagerId() {
		return managerId;
	}

	public void setManagerId(int managerId) {
		this.managerId = managerId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public int getShiftId() {
		return shiftId;
	}

	public void setShiftId(int shiftId) {
		this.shiftId = shiftId;
	}

	public LocalDate getJoinedDate() {
		return joinedDate;
	}

	public void setJoinedDate(LocalDate joinedDate) {
		this.joinedDate = joinedDate;
	}

	//    @NotNull(message = "Shift cannot be null")
	private int shiftId;

	@NotNull(message = "Joined Date cannot be null")
	@Past(message = "Joined Date must be in the past")
	private LocalDate joinedDate;

}