﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AlcoStack.Enums;
using Microsoft.AspNetCore.Identity;

namespace AlcoStack.Models;

public class User : IdentityUser
{
    public string? FirstName { get; set; }    
    public string? LastName { get; set; }
    public Gender Gender { get; set; } = Gender.Other;
    public DateOnly? DateOfBirth { get; set; }
    public Address? Address { get; set; }
    [NotMapped]
    public IFormFile? PhotoFile { get; set; }
    public string? Photo { get; set; }
    public string? Bio { get; set; }
    public string? BackgroundPhoto { get; set; }
    [NotMapped]
    public IFormFile? BackgroundPhotoFile { get; set; }
    
    public ICollection<UserAlcohol> Alcohols { get; set; } = new List<UserAlcohol>();
    
    public ICollection<Party> CreatedParties { get; set; } = new List<Party>();
    
    public ICollection<UserParty> Parties { get; set; } = new List<UserParty>();
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public DateTime UpdatedDate { get; set; } = DateTime.Now; 
}