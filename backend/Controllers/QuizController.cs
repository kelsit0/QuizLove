using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizLove.Api.Data;
using QuizLove.Api.Models;
using System.Text.Json;

namespace QuizLove.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly QuizLoveContext _context;
    private readonly ILogger<QuizController> _logger;

    public QuizController(QuizLoveContext context, ILogger<QuizController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes()
    {
        return await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quiz>> GetQuiz(int id)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
        {
            return NotFound();
        }

        return quiz;
    }

    [HttpPost]
    public async Task<ActionResult<Quiz>> CreateQuiz([FromBody] Quiz quiz)
    {
        try
        {
            _logger.LogInformation("Recibiendo quiz: {Quiz}", JsonSerializer.Serialize(quiz));

            if (quiz == null)
            {
                return BadRequest(new { message = "El quiz no puede ser nulo" });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
                    );
                return BadRequest(new { message = "Datos inválidos", errors });
            }

            // Validaciones adicionales
            if (quiz.Questions == null || !quiz.Questions.Any())
            {
                return BadRequest(new { message = "El quiz debe tener al menos una pregunta" });
            }

            foreach (var question in quiz.Questions)
            {
                if (string.IsNullOrWhiteSpace(question.Text))
                {
                    return BadRequest(new { message = "Todas las preguntas deben tener texto" });
                }

                if (question.Answers == null || question.Answers.Count < 2)
                {
                    return BadRequest(new { message = "Cada pregunta debe tener al menos 2 respuestas" });
                }

                var correctAnswers = question.Answers.Count(a => a.IsCorrect);
                if (correctAnswers != 1)
                {
                    return BadRequest(new { message = "Cada pregunta debe tener exactamente una respuesta correcta" });
                }

                foreach (var answer in question.Answers)
                {
                    if (string.IsNullOrWhiteSpace(answer.Text))
                    {
                        return BadRequest(new { message = "Todas las respuestas deben tener texto" });
                    }
                }
            }

            // Establecer la fecha de creación
            quiz.CreatedAt = DateTime.UtcNow;

            // Limpiar IDs y referencias circulares
            foreach (var question in quiz.Questions)
            {
                question.Id = 0;
                question.QuizId = 0;
                question.Quiz = null;

                foreach (var answer in question.Answers)
                {
                    answer.Id = 0;
                    answer.QuestionId = 0;
                    answer.Question = null;
                }
            }

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            // Recargar el quiz con sus relaciones
            var createdQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == quiz.Id);

            if (createdQuiz == null)
            {
                return StatusCode(500, new { message = "Error al crear el quiz" });
            }

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, createdQuiz);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear quiz");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuiz(int id, Quiz quiz)
    {
        if (id != quiz.Id)
        {
            return BadRequest();
        }

        _context.Entry(quiz).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!QuizExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
        {
            return NotFound();
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool QuizExists(int id)
    {
        return _context.Quizzes.Any(e => e.Id == id);
    }
} 