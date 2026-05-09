namespace MedPra.Api.Models;

public class Disease
{
    public int Id { get; set; }
    public string Specialty { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
