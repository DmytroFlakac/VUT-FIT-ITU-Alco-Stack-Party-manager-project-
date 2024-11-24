using System.ComponentModel.DataAnnotations;


namespace AlcoStack.Models;

public class Party
{
    public Guid Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public string? Photo { get; set; }
    
    public DateTime date { get; set; }
    
    public DateTime preparationDate { get; set; }
    
    [StringLength(100)]
    public string? Location { get; set; }
    
    public bool Liquors { get; set; } = false;
    
    public bool  LowAlcohol { get; set; } = false;
    
    public bool  MidAlcohol { get; set; } = false;
    
    public bool  HighAlcohol { get; set; } = false;
    
    public int RankLimit { get; set; } = 0;
    
    // public bool Status { get; set; } = true;
    public string CreatorUserName { get; set; }
    
    public User Creator { get; set; }
    
    public ICollection<UserParty> Users { get; set; } = new List<UserParty>();
    
    public ICollection<PartyAlcohol> Alcohols { get; set; } = new List<PartyAlcohol>();
    
    public ICollection<PartyUserAlcohol> PartyUserAlcohols { get; set; } = new List<PartyUserAlcohol>();
    
    public bool IsVolumeEvaluated { get; set; } = false;

    
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    
    public DateTime UpdatedDate { get; set; } = DateTime.Now;
}