using System.ComponentModel.DataAnnotations;

namespace AlcoStack.Dtos;

public class CreatePartyDto
{
    
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string? Photo { get; set; }
    
    public DateTime date { get; set; }
    
    public DateTime preparationDate { get; set; }
    public string? Location { get; set; }
    
    [Required]
    public string CreatorUserName { get; set; }
    
}