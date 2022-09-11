package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@Controller
@Secured("ADMIN")
public class AdminController {
    private UserService userService;
    private RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String getAllUsers(ModelMap model, Principal principal) {
        model.addAttribute("profile", userService.getUserByEmail(principal.getName()).orElse(new User()));
        model.addAttribute("table", userService.getUsers());
        model.addAttribute("newUser", new User());
        model.addAttribute("rolesList", roleService.getRoles());
        return "index";
    }

    @PatchMapping("/update")
    public String updateUser(@ModelAttribute User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/create")
    public String setNewUser(@ModelAttribute("newUser") User user) {
        userService.setUser(user);
        return "redirect:/admin";
    }

//    @DeleteMapping("/delete")
//    public String deleteUser(@RequestParam("userId") Long id) {
//        userService.removeUser(id);
//        return "redirect:/admin";
//    }

}
