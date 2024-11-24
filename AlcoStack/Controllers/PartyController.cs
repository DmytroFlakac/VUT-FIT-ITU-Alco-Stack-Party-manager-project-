using AlcoStack.Dtos;
using AlcoStack.Extensions;
using AlcoStack.Interface;
using AlcoStack.Models;
using AlcoStack.Mappers;
using AlcoStack.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlcoStack.Controllers;

[Route("api/party")]
[ApiController]
public class PartyController(
    IPartyRepository repository,
    IPartyAlcoholRepository partyAlcoholRepository,
    IUserPartyRepository userPartyRepository,
    IAlcoholRepository alcoholRepository,
    IPartyUserAlcoholRepository partyUserAlcoholRepository,
    IPartyAlcoholVolumeService PartyAlcoholVolumeService,  
    UserManager<User> userManager,
    SignInManager<User> signinManager)
    : ControllerBase
{
    private readonly SignInManager<User> _signinManager = signinManager;


    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateParty([FromBody] CreatePartyDto partyDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var username = User.GetUsername();
        var user = await userManager.FindByNameAsync(username);

        if (user == null)
        {
            return BadRequest("User not found");   
        }
        
        var party = partyDto.MapToCreateModel();
        var createdParty = await repository.CreateAsync(party);
        
        await userPartyRepository.AddAsync(username, createdParty.Id);
        
        return CreatedAtAction(nameof(GetParty), new { Id = createdParty.Id }, createdParty.MapToDto(username));
    }

    [Authorize]
    [HttpGet("{Id}")]
    public async Task<IActionResult> GetParty(Guid Id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        string userName = User.GetUsername();
        
        var party = await repository.GetByIdAsync(Id);
        if (party == null)
        {
            return NotFound();
        }
        return Ok(party.MapToDto(userName));
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllParties()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        string userName = User.GetUsername();
        
        var parties = await repository.GetAllAsync();
        
        if (parties == null)
        {
            return NotFound();
        }
        
        return Ok(parties.Select(party => party.MapToDto(userName))); 
    }

    [Authorize]
    [HttpPut("{Id}")]
    public async Task<IActionResult> UpdateParty(Guid Id, [FromBody] UpdatePartyDto partyDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        string userName = User.GetUsername();
        
        var party = await repository.UpdateAsync(Id, partyDto);
        
        if (party == null)
        {
            return NotFound();
        }
        return Ok(party.MapToDto(userName));
    }

    [Authorize]
    [HttpDelete("{Id}")]
    public async Task<IActionResult> DeleteParty(Guid Id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        string userName = User.GetUsername();
        
        var party = await repository.DeleteAsync(Id);
        if (party == null)
        {
            return NotFound();
        }
        return Ok(party.MapToDto(userName));
    }
    
    [Authorize]
    [HttpPost("{partyId}/add-alcohol/{alcoholId}")]
    public async Task<IActionResult> AddAlcoholToParty(Guid partyId, Guid alcoholId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return Ok(await partyAlcoholRepository.AddAsync(partyId, alcoholId));
    }
    
    [Authorize]
    [HttpPost("{partyId}/add-user")]
    public async Task<IActionResult> AddUserToParty(Guid partyId)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Invalid Party ID format." });
        
        var userName = User.GetUsername();
        var party = await repository.GetByIdAsync(partyId);
        if (party == null || party.date < DateTime.UtcNow)
        {
           
            return NotFound(new { message = "Party is not found." });
        }
        return Ok(await userPartyRepository.AddAsync(userName, partyId));
    }
    
    [Authorize]
    [HttpDelete("{partyId}/delete-alcohol/{alcoholId}")]
    public async Task<IActionResult> DeleteAlcoholFromParty(Guid partyId, Guid alcoholId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var partyAlcohol = await partyAlcoholRepository.DeleteAsync(partyId, alcoholId);
        if (partyAlcohol == null)
        {
            return NotFound();
        }
        return Ok(partyAlcohol);
    }
    
    [HttpGet("{partyId}/alcohols")]
    public async Task<IActionResult> GetAlcoholsByPartyId(Guid partyId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return Ok(await partyAlcoholRepository.GetAlcoholsByPartyIdAsync(partyId));
    }
    
    
    
    [Authorize]
    [HttpGet("userParties")]
    public async Task<IActionResult> GetPartiesByUserName()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var userName = User.GetUsername();
        
        var parties = await userPartyRepository.GetByUserNameAsync(userName);

        if (parties == null)
        {
            return NotFound();
        }

        return Ok(parties.Select(party => party.MapToListDto(userName)));
    }
    
    [Authorize]
    [HttpGet("partyHistory")]
    public async Task<IActionResult> GetPartyHistoryByUserName()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var userName = User.GetUsername();
        
        var parties = await userPartyRepository.GetHistoryByUserNameAsync(userName);

        if (parties == null)
        {
            return NotFound();
        }

        return Ok(parties.Select(party => party.MapToListDto(userName)));
    }
    
    
   
    [Authorize]
    [HttpDelete("{partyId}remove-user/{userName}")]
    public async Task<IActionResult> RemoveUserFromParty(Guid partyId, string userName)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var UserName = User.GetUsername();
        
        var party = await repository.GetByIdAsync(partyId);
        
        if(party == null)
        {
            throw new Exception("Party not found");
        }
        
        if(party.CreatorUserName != UserName)
        {
            throw new Exception("You are not the creator of this party");
        }
        
        var userParty = await userPartyRepository.DeleteAsync(userName, partyId);
        if (userParty == null)
        {
            return NotFound();
        }
        return Ok(userParty);
    }
    
    [Authorize]
    [HttpPatch("{partyId}/update-volume")]
    public async Task<IActionResult> UpdateVolume(Guid partyId,  PartyUserAlcoholDto Volumes)
    {
        var UserName = User.GetUsername();
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return Ok(await partyUserAlcoholRepository.UpdateAmountAsync(UserName, partyId, Volumes));
    }
    
    [HttpGet("{partyId}/alcohol-volumes")]
    public async Task<IActionResult> GetPartyAlcoholVolumes(Guid partyId, [FromQuery] bool isClicked)
    {

        var party =  await repository.GetByIdAsync(partyId);

        if (party == null)
        {
            return NotFound();
        }
        
        if (!party.IsVolumeEvaluated)
        {
            var result = await PartyAlcoholVolumeService.CalculateAndSavePartyAlcoholVolumesAsync(partyId);
            return Ok(result);
        }
        else
        {
            var result = await partyAlcoholRepository.GetPartyUserAlcoholsWithVolumeAsync(partyId);
            return Ok(result);
        }        
            
    }
   
    [Authorize]
    [HttpPatch("{partyId}/update-rank/{alcoholId}")]
    public async Task<IActionResult> UpdateRank(Guid partyId, Guid alcoholId, [FromBody] int rank)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return Ok(await partyAlcoholRepository.UpdateRankAsync(partyId, alcoholId, rank));
    }
    [Authorize]
    [HttpPatch("{partyId}/update-alcohol-purchases")]
    public async Task<PartyUserAlcoholPurchaseDto> UpdateAlcoholPurchases(Guid partyId, PartyUserAlcoholPurchaseDto purchaseDto)
    {
        // Call the repository method to update purchases and return updated data
        return await partyAlcoholRepository.UpdateAlcoholPurchasesAsync(partyId, purchaseDto);
    }
    
}


