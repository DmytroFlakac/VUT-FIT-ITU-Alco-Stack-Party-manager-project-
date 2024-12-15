using AlcoStack.Interface;
using AlcoStack.Dtos;
using AlcoStack.Data;
using AlcoStack.Models;
using Microsoft.EntityFrameworkCore;
namespace AlcoStack.Repositories;

public class PartyUserAlcoholRepository(AppDataContext context) : IPartyUserAlcoholRepository
{
    public async Task<PartyUserAlcoholDto> UpdateAmountAsync(string username, Guid partyId, PartyUserAlcoholDto userPartyAlcohols)
    {
        // Ensure the user exists
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        if (user == null)
        {
            throw new Exception($"User with username '{username}' does not exist.");
        }

        // Validate if the user is part of the party
        var userParty = await context.UserParties
            .FirstOrDefaultAsync(up => up.UserName == username && up.PartyId == partyId);

        if (userParty == null)
        {
            throw new Exception("User is not part of this party.");
        }

        // Fetch the list of alcohols in the party's ranking
        var partyAlcoholNames = await context.PartyAlcohols
            .Where(pa => pa.PartyId == partyId)
            .Select(pa => pa.Alcohol.Name)
            .ToListAsync();

        if (!partyAlcoholNames.Any())
        {
            throw new Exception("No ranked alcohols found for this party.");
        }

        var updatedVolumes = new List<AlcoholVolumeDto>();

        // Process and update volumes
        foreach (var volumeUpdate in userPartyAlcohols.AlcoholVolume)
        {
            if (partyAlcoholNames.Contains(volumeUpdate.Name))
            {
                var alcohol = await context.Alcohols
                    .FirstOrDefaultAsync(a => a.Name == volumeUpdate.Name);

                if (alcohol == null)
                {
                    continue;
                }

                var userPartyAlcoholEntry = await context.PartyUserAlcohols
                    .FirstOrDefaultAsync(upa =>
                        upa.UserName == user.Id &&
                        upa.PartyId == partyId &&
                        upa.AlcoholId == alcohol.Id);

                if (userPartyAlcoholEntry != null)
                {
                    userPartyAlcoholEntry.Volume = volumeUpdate.Volume;
                }
                

                updatedVolumes.Add(new AlcoholVolumeDto
                {
                    Name = volumeUpdate.Name,
                    Volume = volumeUpdate.Volume
                });
            }
        }

        // Save changes to the database
        await context.SaveChangesAsync();

        // Return the updated data
        return new PartyUserAlcoholDto
        {
            AlcoholVolume = updatedVolumes
        };
    }

    public async Task<PartyUserAlcoholDto?> GetPartyAlcoholVolumeAsync(Guid partyId)
    {
        // Fetch all alcohols and their volumes associated with the specified party
        var partyAlcohols = await context.PartyUserAlcohols
            .Where(pa => pa.PartyId == partyId)
            .GroupBy(pa => pa.AlcoholId) // Group by alcohol ID
            .Select(group => new AlcoholVolumeDto
            {
                Name = group.FirstOrDefault().Alcohol.Name, // Alcohol name from the first entry in the group
                Volume = group.Sum(pa => pa.Volume) // Sum up the volumes
            })
            .Where(dto => dto.Volume > 0) // Exclude alcohols with a total volume of 0
            .ToListAsync();


        // If all volumes sum to 0, return null
        if (partyAlcohols.All(alcohol => alcohol.Volume == 0))
        {
            return null;
        }

        // Create and return the DTO
        return new PartyUserAlcoholDto
        {
            AlcoholVolume = partyAlcohols
        };
    }
    
    



}