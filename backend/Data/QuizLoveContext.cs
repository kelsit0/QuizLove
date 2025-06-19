using Microsoft.EntityFrameworkCore;
using QuizLove.Api.Models;

namespace QuizLove.Api.Data;

public class QuizLoveContext : DbContext
{
    public QuizLoveContext(DbContextOptions<QuizLoveContext> options) : base(options)
    {
    }

    public DbSet<Quiz> Quizzes { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<Answer> Answers { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuración de Quiz
        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CreatorId).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            
            entity.HasMany(q => q.Questions)
                  .WithOne(q => q.Quiz)
                  .HasForeignKey(q => q.QuizId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de Question
        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(500);
            
            entity.HasMany(q => q.Answers)
                  .WithOne(a => a.Question)
                  .HasForeignKey(a => a.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de Answer
        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(500);
            entity.Property(e => e.IsCorrect).IsRequired();
        });

        // Datos de ejemplo (seed)
        modelBuilder.Entity<Quiz>().HasData(
            new Quiz
            {
                Id = 1,
                Title = "Quiz de Ejemplo",
                Description = "Este es un quiz de ejemplo",
                CreatorId = "system",
                CreatedAt = DateTime.UtcNow
            }
        );

        modelBuilder.Entity<Question>().HasData(
            new Question
            {
                Id = 1,
                QuizId = 1,
                Text = "¿Cuál es la capital de España?"
            }
        );

        modelBuilder.Entity<Answer>().HasData(
            new Answer
            {
                Id = 1,
                QuestionId = 1,
                Text = "Madrid",
                IsCorrect = true
            },
            new Answer
            {
                Id = 2,
                QuestionId = 1,
                Text = "Barcelona",
                IsCorrect = false
            }
        );
    }
} 