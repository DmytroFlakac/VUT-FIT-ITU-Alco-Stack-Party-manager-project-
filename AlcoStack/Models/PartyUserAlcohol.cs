namespace AlcoStack.Models;

public class PartyUserAlcohol
{
        public string UserName { get; set; }
        //public string UserName { get; set; }
        // Reference to the UserParty
        public Guid PartyId { get; set; }
        
        // Reference to the Alcohol
        public Guid AlcoholId { get; set; }
        
        public User User { get; set; }
        
        public Party Party { get; set; }
        public Alcohol Alcohol { get; set; }
        
        // Volume of the alcohol for the user in this party
        public double Volume { get; set; } = 0.0;

        
}