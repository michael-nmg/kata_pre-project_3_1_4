package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@Controller
public class AdminController {

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;

    }

    @ModelAttribute("table")
    public List<User> allUsers() {
        return userService.getUsers();
    }

    @GetMapping("/admin")
    public String getAllUsers(ModelMap model) {
        model.addAttribute("newUser", new User());
        model.addAttribute("rolesList", roleService.getRoles());
        return "admin";
    }

    @PostMapping("/admin")
    public String setNewUser(@ModelAttribute("newUser") User user) {
        userService.setUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/admin")
    public String deleteUser(@RequestParam("name") Long id) {
        userService.removeUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/admin/{id}")
    public String editUser(ModelMap model, @PathVariable("id") Long id) {
        model.addAttribute("userByID", userService.getUser(id));
        model.addAttribute("rolesList", roleService.getRoles());
        return "edit";
    }

    @PatchMapping("admin/{id}")
    public String patchUser(@ModelAttribute("userByID") User user) {
        userService.setUser(user);
        return "redirect:/admin";
    }
}
