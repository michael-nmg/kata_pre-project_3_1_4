package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleService {
    void setRole(Role role);

    Role getRole(Byte id);

    List<Role> getRoles();

    void removeRole(Role role);
}
