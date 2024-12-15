using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using AlcoStack.Enums;
using AlcoStack.Models;

namespace AlcoStack.Dtos;

public class RegisterDto
{ 
    [Required]
    public string? Username { get; set; }
    [Required]
    [EmailAddress]
    public string? Email { get; set; }
    [Required]
    public string? Password { get; set; }

    public string? FirstName { get; set; }   

    public string? LastName { get; set; }
    
    public Gender Gender { get; set; } = Gender.Other;
    public DateOnly? DateOfBirth { get; set; }   

    public AddressDto? Address { get; set; }  

    public string? Phone { get; set; }  
    public string? Bio { get; set; }
   
}