using AlcoStack.Data;
using AlcoStack.Service;
using AlcoStack.Dtos;
using AlcoStack.Interface;
using Microsoft.EntityFrameworkCore;

namespace AlcoStack.Service;



public class PartyAlcoholVolumeService(AppDataContext context) : IPartyAlcoholVolumeService
{


    public async Task<PartyUserAlcoholDto> CalculateAndSavePartyAlcoholVolumesAsync(Guid partyId)
    {
        // Fetch the party with the specified PartyId
        var party = await context.Parties
            .FirstOrDefaultAsync(p => p.Id == partyId);

        if (party == null)
        {
            throw new Exception($"Party with ID '{partyId}' does not exist.");
        }
       
        

        // Fetch all PartyUserAlcohol entries for this party
        var partyUserAlcohols = await context.PartyUserAlcohols
            .Where(pua => pua.PartyId == partyId)
            .Include(pua => pua.Alcohol) // Include Alcohol data
            .ToListAsync();

        if (!partyUserAlcohols.Any())
        {
            throw new Exception($"No PartyUserAlcohol entries found for Party ID '{partyId}'.");
        }

        // Group by AlcoholId and calculate the total volume for each Alcohol
        var alcoholVolumes = partyUserAlcohols
            .GroupBy(pua => pua.AlcoholId)
            .Select(group => new
            {
                AlcoholId = group.Key,
                TotalVolume = Math.Round(group.Sum(pua => pua.Volume), 1) // Round to 1 decimal place
            })
            .Where(a => a.TotalVolume > 0) // Include only non-zero volumes
            .ToList();

        // Update the PartyAlcohol table with the calculated volumes
        foreach (var alcoholVolume in alcoholVolumes)
        {
            var partyAlcohol = await context.PartyAlcohols
                .FirstOrDefaultAsync(pa => pa.PartyId == partyId && pa.AlcoholId == alcoholVolume.AlcoholId);

            if (partyAlcohol != null)
            {
                partyAlcohol.Volume = alcoholVolume.TotalVolume;
            }

        }
        party.IsVolumeEvaluated = true;
        // Save changes to the database
        await context.SaveChangesAsync();

        // Prepare and return the result
        var result = new PartyUserAlcoholDto
        {
            AlcoholVolume = alcoholVolumes.Select(a => new AlcoholVolumeDto
            {
                    Name = partyUserAlcohols
                    .First(pua => pua.AlcoholId == a.AlcoholId)
                    .Alcohol.Name,
                Volume = a.TotalVolume
            }).ToList()
        };

        
        

        return result;

    }
}
