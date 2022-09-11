package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.*;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RestProjectController {

    private final UserService userService;
    private final RoleService roleService;

    public RestProjectController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/user")
    public User getUserSession(Principal principal) {
        return userService.getUserByEmail(principal.getName()).orElse(null);
    }

    @GetMapping("/users/roles")
    public List<Role> getAllRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/users/{id}")
    public User getUserByID(@PathVariable("id") Long id) {
        return userService.getUser(id);
    }

    @PostMapping("/users")
    public ResponseEntity setNewUser(@RequestBody User user) {
        userService.setUser(user);
        return ResponseEntity.ok().body(String.format("New user: %s is create", user));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.ok().body(String.format("User: %s is update", user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity deleteUserById(@PathVariable("id") Long id) {
        userService.removeUser(id);
        return ResponseEntity.ok().body(String.format("User with id:%s is deleted", id));
    }

}
