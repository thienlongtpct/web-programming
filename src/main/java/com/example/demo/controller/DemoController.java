package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class DemoController {
    @GetMapping("/add")
    boolean checkInside(@RequestParam double x, @RequestParam double y, @RequestParam double r){
        if(x > r) return false;
        if(x < - r) return false;
        if(y > r) return false;
        if(y < -r) return false;
        if(x < 0 && y < 0) return false;
        if(x < 0){
            if( x * x + y * y > r * r) return false;
        }
        else{
            if(y > 0)  return Math.abs(x-r) > 2*y;
        }
        return true;
    }




}
