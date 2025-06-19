using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizLove.Api.Models;

public class Answer
{
    public int Id { get; set; }
    
    [JsonIgnore]
    public int QuestionId { get; set; }
    
    [Required(ErrorMessage = "El texto de la respuesta es requerido")]
    [StringLength(500, ErrorMessage = "El texto de la respuesta no puede tener más de 500 caracteres")]
    public string Text { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Debe indicar si la respuesta es correcta")]
    public bool IsCorrect { get; set; }
    
    [JsonIgnore]
    public Question? Question { get; set; }

    public Answer()
    {
        Text = string.Empty;
        IsCorrect = false;
    }
} 