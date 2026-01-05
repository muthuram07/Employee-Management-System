package com.cognizant.authenticationservice;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cognizant.authenticationservice.util.JwtUtil;
import com.cognizant.authenticationservice.*;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component

public class JwtRequestFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private UserDetailsImp userDetailsImp;

	protected void doFilterInternal(HttpServletRequest request,

			HttpServletResponse response,

			FilterChain filterChain) throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {

			String token = authHeader.substring(7);

			String username = jwtUtil.extractUsername(token);

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails userDetails  = 
						userDetailsImp.loadUserByUsername(username);

				if (jwtUtil.validateToken(token)) {
					String role = jwtUtil.extractRole(token);
					List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

					/*
					 * List<GrantedAuthority> authorities = jwtUtil.extractRoles(token).stream()
					 * 
					 * .map(SimpleGrantedAuthority::new)
					 * 
					 * .collect(Collectors.toList());
					 */

					UsernamePasswordAuthenticationToken authToken =

							new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

					SecurityContextHolder.getContext().setAuthentication(authToken);

				}

			}

		}

		filterChain.doFilter(request, response);

	}

}
