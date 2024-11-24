using AlcoStack.Models;
using AlcoStack.Interface;
using AlcoStack.Dtos;
using AlcoStack.Data;
using AlcoStack.Enums;
using Microsoft.EntityFrameworkCore;


namespace AlcoStack.Repositories;

public class PartyAlcoholRepository(AppDataContext context) : IPartyAlcoholRepository
{
    public async Task<PartyAlcohol> AddAsync(Guid partyId, Guid alcoholId)
    {
        var party = await context.Parties.FirstOrDefaultAsync(x => x.Id == partyId);
        
        if (party == null)
        {
            throw new Exception("Party not found");
        }
        
        var alcohol = await context.Alcohols.FirstOrDefaultAsync(x => x.Id == alcoholId);
        
        if (alcohol == null)
        {
            throw new Exception("Alcohol not found");
        }
        
        var partyAlcohol = new PartyAlcohol
        {
            PartyId = partyId,
            AlcoholId = alcoholId,
            Party = party,
            Alcohol = alcohol
        };
        
        await context.PartyAlcohols.AddAsync(partyAlcohol);
        await context.SaveChangesAsync();
        return partyAlcohol;
    }

    public async Task<PartyAlcohol?> DeleteAsync(Guid partyId, Guid alcoholId)
    {
        var partyAlcohol = await context.PartyAlcohols
            .FirstOrDefaultAsync(x => x.PartyId == partyId && x.AlcoholId == alcoholId);
        
        if (partyAlcohol == null)
        {
            return null;
        }
        
        context.PartyAlcohols.Remove(partyAlcohol);
        await context.SaveChangesAsync();
        return partyAlcohol;
    }

    public async Task<ICollection<Alcohol>> GetAlcoholsByPartyIdAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .Select(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }

    public async Task<ICollection<Alcohol>?> GetByRankAndLimitAsync(Guid partyId, int rankLimit)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId && x.Rank > 0)
            .Include(x => x.Alcohol)
            .OrderBy(x => x.Rank)
            .Take(rankLimit)
            .Select(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }
    
    public async Task<ICollection<Alcohol>?> GetByRankAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId && x.Rank > 0)
            .Include(x => x.Alcohol)
            .OrderBy(x => x.Rank)
            .Select(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> UpdateVolumeAsync(Guid partyId, Guid alcoholId, int volume)
    {
        var partyAlcohol = await context.PartyAlcohols
            .FirstOrDefaultAsync(x => x.PartyId == partyId && x.AlcoholId == alcoholId);
     //   var ratedAlcohols = await GetByRankAsync(partyId);
        
        if (partyAlcohol == null)
        {
            throw new Exception("PartyAlcohol not found");
        }
        
        partyAlcohol.Volume = volume;
        await context.SaveChangesAsync();
        
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> UpdateRankAsync(Guid partyId, Guid alcoholId, int rank)
    {
        var partyAlcohol = await context.PartyAlcohols
            .FirstOrDefaultAsync(x => x.PartyId == partyId && x.AlcoholId == alcoholId);
        
        if (partyAlcohol == null)
        {
            throw new Exception("PartyAlcohol not found");
        }

        partyAlcohol.Rank = rank;
        await context.SaveChangesAsync();
        
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> AddLiqoursAsync(Guid partyId)
    {
        var party = await context.Parties.FirstOrDefaultAsync(x => x.Id == partyId);
        
        
        
        if (party == null)
        {
            throw new Exception("Party not found");
        }
        
        var liquors = await context.Alcohols
            .Where(x => x.Type == AlcoType.Liquor)
            .ToListAsync();
        
        var partyAlcohols = new List<PartyAlcohol>();
        
        foreach (var liquor in liquors)
        {
            var partyAlcohol = new PartyAlcohol
            {
                PartyId = partyId,
                AlcoholId = liquor.Id,
                Party = party,
                Alcohol = liquor
            };
            
            partyAlcohols.Add(partyAlcohol);
        }
        
        await context.PartyAlcohols.AddRangeAsync(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> AddLowAlcoholsAsync(Guid partyId)
    {
        var party = await context.Parties.FirstOrDefaultAsync(x => x.Id == partyId);
        
        if (party == null)
        {
            throw new Exception("Party not found");
        }
        
        var lowAlcohols = await context.Alcohols
            .Where(x => x.Type == AlcoType.LowAlcohol)
            .ToListAsync();
        
        var partyAlcohols = new List<PartyAlcohol>();
        
        foreach (var lowAlcohol in lowAlcohols)
        {
            var partyAlcohol = new PartyAlcohol
            {
                PartyId = partyId,
                AlcoholId = lowAlcohol.Id,
                Party = party,
                Alcohol = lowAlcohol
            };
            
            partyAlcohols.Add(partyAlcohol);
        }
        
        await context.PartyAlcohols.AddRangeAsync(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> AddMidAlcoholsAsync(Guid partyId)
    {
        var party = await context.Parties.FirstOrDefaultAsync(x => x.Id == partyId);
        
        if (party == null)
        {
            throw new Exception("Party not found");
        }
        
        var midAlcohols = await context.Alcohols
            .Where(x => x.Type == AlcoType.MidlAlcohol)
            .ToListAsync();
        
        var partyAlcohols = new List<PartyAlcohol>();
        
        foreach (var midAlcohol in midAlcohols)
        {
            var partyAlcohol = new PartyAlcohol
            {
                PartyId = partyId,
                AlcoholId = midAlcohol.Id,
                Party = party,
                Alcohol = midAlcohol
            };
            
            partyAlcohols.Add(partyAlcohol);
        }
        
        await context.PartyAlcohols.AddRangeAsync(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> AddHighAlcoholsAsync(Guid partyId)
    {
        var party = await context.Parties.FirstOrDefaultAsync(x => x.Id == partyId);
        
        if (party == null)
        {
            throw new Exception("Party not found");
        }
        
        var hAlcohols = await context.Alcohols
            .Where(x => x.Type == AlcoType.HighAlcohol)
            .ToListAsync();
        
        var partyAlcohols = new List<PartyAlcohol>();
        
        foreach (var hAlcohol in hAlcohols)
        {
            var partyAlcohol = new PartyAlcohol
            {
                PartyId = partyId,
                AlcoholId = hAlcohol.Id,
                Party = party,
                Alcohol = hAlcohol
            };
            
            partyAlcohols.Add(partyAlcohol);
        }
        
        await context.PartyAlcohols.AddRangeAsync(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> DeleteLiqoursAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .Where(x => x.Alcohol.Type == AlcoType.Liquor)
            .ToListAsync();
        
        context.PartyAlcohols.RemoveRange(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> DeleteLowAlcoholsAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .Where(x => x.Alcohol.Type == AlcoType.LowAlcohol)
            .ToListAsync();
        
        context.PartyAlcohols.RemoveRange(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> DeleteMidAlcoholsAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .Where(x => x.Alcohol.Type == AlcoType.MidlAlcohol)
            .ToListAsync();
        
        context.PartyAlcohols.RemoveRange(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> DeleteHighAlcoholsAsync(Guid partyId)
    {
        var partyAlcohols = await context.PartyAlcohols
            .Where(x => x.PartyId == partyId)
            .Include(x => x.Alcohol)
            .Where(x => x.Alcohol.Type == AlcoType.HighAlcohol)
            .ToListAsync();
        
        context.PartyAlcohols.RemoveRange(partyAlcohols);
        await context.SaveChangesAsync();
        return partyAlcohols;
    }

    public async Task<ICollection<PartyAlcohol>> GetAllAsync()
    {
        var partyAlcohols = await context.PartyAlcohols
            .Include(x => x.Party)
            .Include(x => x.Alcohol)
            .ToListAsync();
        
        return partyAlcohols;
    }
    
    public async Task<PartyUserAlcoholPurchaseDto> UpdateAlcoholPurchasesAsync(Guid partyId, PartyUserAlcoholPurchaseDto purchaseDto)
    {
        // Include the Alcohol navigation property to ensure it's loaded
        var partyAlcohols = await context.PartyAlcohols
            .Where(pa => pa.PartyId == partyId)
            .Include(pa => pa.Alcohol) // Ensure Alcohol is loaded
            .ToListAsync();

        // Iterate through the purchases in the DTO
        foreach (var purchase in purchaseDto.AlcoholPurchases)
        {
            // Find the corresponding PartyAlcohol
            var partyAlcohol = partyAlcohols.FirstOrDefault(pa => pa.Alcohol?.Name == purchase.Name);
            if (partyAlcohol != null)
            {
                // Update the WillBeBought value
                partyAlcohol.WillBeBought = purchase.WillBeBought;
            }
        }

        // Save changes to the database
        await context.SaveChangesAsync();

        // Prepare the updated data to return
        var updatedPurchases = await context.PartyAlcohols
            .Where(pa => pa.PartyId == partyId)
            .Include(pa => pa.Alcohol) // Ensure Alcohol is loaded for the return DTO
            .Select(pa => new AlcoholPurchaseDto
            {
                Name = pa.Alcohol.Name, // Safeguard against null Alcohol
                WillBeBought = pa.WillBeBought ?? false // Handle nullable WillBeBought
            })
            .ToListAsync();

        return new PartyUserAlcoholPurchaseDto
        {
            AlcoholPurchases = updatedPurchases
        };
    }
    
    public async Task<PartyUserAlcoholDto> GetPartyUserAlcoholsWithVolumeAsync(Guid partyId)
    {
        // Fetch PartyAlcohol entries for the given partyId where volume > 0
        var partyAlcohols = await context.PartyAlcohols
            .Where(pa => pa.PartyId == partyId && pa.Volume > 0)
            .Include(pa => pa.Alcohol) // Include Alcohol details
            .ToListAsync();

        if (!partyAlcohols.Any())
        {
            throw new Exception($"No alcohols with non-zero volume found for Party ID '{partyId}'.");
        }

        // Map the PartyAlcohol entries to a PartyUserAlcoholDto
        var result = new PartyUserAlcoholDto
        {
            AlcoholVolume = partyAlcohols.Select(pa => new AlcoholVolumeDto
            {
                Name = pa.Alcohol.Name,
                Volume = pa.Volume
            }).ToList()
        };

        return result;
    }
    
    public async Task<bool> AnyAsync(Guid partyId)
    {
        return await context.PartyAlcohols.AnyAsync(pa => pa.PartyId == partyId);
    }



}