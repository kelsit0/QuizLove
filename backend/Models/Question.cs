using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizLove.Api.Models;

public class Question
{
    public int Id { get; set; }
    
    [JsonIgnore]
    public int QuizId { get; set; }
    
    [Required(ErrorMessage = "El texto de la pregunta es requerido")]
    [StringLength(500, ErrorMessage = "El texto de la pregunta no puede tener más de 500 caracteres")]
    public string Text { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "La pregunta debe tener respuestas")]
    [MinLength(2, ErrorMessage = "La pregunta debe tener al menos 2 respuestas")]
    public List<Answer> Answers { get; set; } = new();
    
    [JsonIgnore]
    public Quiz? Quiz { get; set; }

    public Question()
    {
        Answers = new List<Answer>();
    }
} 