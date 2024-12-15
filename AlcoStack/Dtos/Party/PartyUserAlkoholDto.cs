namespace AlcoStack.Dtos;

public class PartyUserAlcoholDto
{
    public List<AlcoholVolumeDto> AlcoholVolume { get; set; }
}

public class AlcoholVolumeDto
{
    
    public string Name { get; set; } // Unique identifier for the alcohol
    public double Volume { get; set; }    // Volume of alcohol for the user
}