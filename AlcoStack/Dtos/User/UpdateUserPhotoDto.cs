using System.ComponentModel.DataAnnotations;
using AlcoStack.Enums;
using AlcoStack.Models;
using Newtonsoft.Json;

namespace AlcoStack.Dtos;

public class UpdateUserPhotoDto
{
    public bool PhotoChanged { get; set; }
    
    public bool FormBackgroundChanged { get; set; }
    public IFormFile? PhotoFile { get; set; }
}