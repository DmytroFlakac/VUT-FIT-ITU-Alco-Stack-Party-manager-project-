﻿using AlcoStack.Models;
using AlcoStack.Enums;

namespace AlcoStack.Dtos;

public class PartyDto
{
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string? Photo { get; set; }
    
    public DateTime Date { get; set; }
    
    public string? Location { get; set; }
    
    public bool Liquors { get; set; } = false;
    
    public bool  LowAlcohol { get; set; } = false;
    
    public bool  MidAlcohol { get; set; } = false;
    
    public bool  HighAlcohol { get; set; } = false;
    
    public int RankLimit { get; set; } = 0;
    
    // public int[]? VolumeList { get; set; }
    
    public bool CreatedByMe { get; set; }
    
    // public ICollection<User> Users { get; set; } = new List<User>();
    //
    // public ICollection<Alcohol> Alcohols { get; set; } = new List<Alcohol>();
    
}