using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizLove.Api.Models;

public class Quiz
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "El título es requerido")]
    [StringLength(100, ErrorMessage = "El título no puede tener más de 100 caracteres")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "La descripción es requerida")]
    [StringLength(500, ErrorMessage = "La descripción no puede tener más de 500 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "El creador es requerido")]
    public string CreatorId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
    
    [Required(ErrorMessage = "El quiz debe tener al menos una pregunta")]
    [MinLength(1, ErrorMessage = "El quiz debe tener al menos una pregunta")]
    public List<Question> Questions { get; set; } = new();

    public Quiz()
    {
        Questions = new List<Question>();
        CreatedAt = DateTime.UtcNow;
    }
} 