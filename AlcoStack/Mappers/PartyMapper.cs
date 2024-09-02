﻿using AlcoStack.Dtos;
using AlcoStack.Models;

namespace AlcoStack.Mappers;

public static class PartyMapper
{
    public static PartyDto MapToDto(this Party party) => new PartyDto
    {
        Id = party.Id,
        Name = party.Name,
        Description = party.Description,
        Date = party.Date,
        Location = party.Location,
        Liquors = party.Liquors,
        LowAlcohol = party.LowAlcohol,
        MidAlcohol = party.MidAlcohol,
        HighAlcohol = party.HighAlcohol,
        Status = party.Status,
    };

    public static Party MapToCreateModel(this CreatePartyDto partyDto) => new Party
    {
        Name = partyDto.Name,
        Description = partyDto.Description,
        Date = partyDto.Date,
        Location = partyDto.Location,
    };
    
    public static Party MapToUpdateModel(this UpdatePartyDto partyDto) => new Party
    {
        Name = partyDto.Name,
        Description = partyDto.Description,
        Date = partyDto.Date,
        Location = partyDto.Location,
        Liquors = partyDto.Liquors,
        LowAlcohol = partyDto.LowAlcohol,
        MidAlcohol = partyDto.MidAlcohol,
        HighAlcohol = partyDto.HighAlcohol,
        Status = partyDto.Status,
    };
}