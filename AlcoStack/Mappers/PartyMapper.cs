using AlcoStack.Dtos;
using AlcoStack.Models;

namespace AlcoStack.Mappers;

public static class PartyMapper
{
    public static PartyDto MapToDto(this Party party, string userName) => new PartyDto
    {
        Name = party.Name,
        Description = party.Description,
        date = party.date,
        preparationDate = party.preparationDate,
        Location = party.Location,
        Liquors = party.Liquors,
        LowAlcohol = party.LowAlcohol,
        MidAlcohol = party.MidAlcohol,
        HighAlcohol = party.HighAlcohol,
        RankLimit = party.RankLimit,
        // Status = party.Status,
        Photo = party.Photo,
        CreatedByMe = party.CreatorUserName == userName,
    };
    

    public static Party MapToCreateModel(this CreatePartyDto partyDto) => new Party
    {
        Name = partyDto.Name,
        Description = partyDto.Description,
        date = partyDto.date,
        preparationDate = partyDto.preparationDate,
        Location = partyDto.Location,
        Photo = partyDto.Photo,
        CreatorUserName = partyDto.CreatorUserName,
    };
    
    public static Party MapToUpdateModel(this UpdatePartyDto partyDto) => new Party
    {
        Name = partyDto.Name,
        Description = partyDto.Description,
        date = partyDto.date,
        preparationDate = partyDto.preparationDate,
        Location = partyDto.Location,
        Liquors = partyDto.Liquors,
        LowAlcohol = partyDto.LowAlcohol,
        MidAlcohol = partyDto.MidAlcohol,
        HighAlcohol = partyDto.HighAlcohol,
        RankLimit = partyDto.RankLimit,
        // Status = partyDto.Status,
        Photo = partyDto.Photo,
    };
    
    public static PartyListDto MapToListDto(this Party party, string userName) => new PartyListDto
    {
        PartyId = party.Id,
        Name = party.Name,
        Description = party.Description,
        date = party.date,
        CreatedByMe = party.CreatorUserName == userName,
    };
}