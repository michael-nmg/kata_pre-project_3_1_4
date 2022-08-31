package ru.kata.spring.boot_security.demo.model;

import org.springframework.security.core.GrantedAuthority;
import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Byte id;

    @Column
    private String name;

    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    public Byte getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String getAuthority() {
        return name;
    }

    public void setId() {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

}
