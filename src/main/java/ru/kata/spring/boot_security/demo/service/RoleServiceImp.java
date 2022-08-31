package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImp implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImp(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    public void setRole(Role role) {
        roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public Role getRole(Byte id) {
        return roleRepository.findById(id).orElse(new Role());
    }

    @Transactional(readOnly = true)
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Transactional
    public void removeRole(Role role) {
        roleRepository.delete(role);
    }
}
