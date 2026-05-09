namespace MedPra.Api.DTOs;

public record AddDiseaseRequest(string Specialty, string Name);

public record DiseaseDto(int Id, string Specialty, string Name, bool IsActive);
