import React, { useState, useEffect } from 'react';
import './styles.css';

const StudyPlanner = () => {
  // Subject data
  const subjectsData = [
    {
      id: 5,
      name: "Object Oriented Analysis and Design",
      examDate: "March 27th",
      chapters: []
    },
    {
      id: 4,
      name: "Engineering Economics",
      examDate: "March 31st",
      chapters: []
    },
    {
      id: 1,
      name: "Database Management System",
      examDate: "April 4th",
      chapters: []
    },
    {
      id: 3,
      name: "Operating System",
      examDate: "April 8th",
      chapters: []
    },
    {
      id: 6,
      name: "Embedded System",
      examDate: "April 12th",
      chapters: []
    },
    {
      id: 2,
      name: "Artificial Intelligence",
      examDate: "April 16th",
      chapters: []
    }
  ];

  // Course data
  const coursesData = {
    "Operating System": [
      { id: 1, name: "Introduction", marks: 8 },
      { id: 2, name: "Process Management", marks: 10 },
      { id: 3, name: "Process Communication & Synchronization", marks: 10 },
      { id: 4, name: "Memory Management", marks: 10 },
      { id: 5, name: "File Systems", marks: 8 },
      { id: 6, name: "I/O Management", marks: 10 },
      { id: 7, name: "Deadlock", marks: 10 },
      { id: 8, name: "Security", marks: 10 },
      { id: 9, name: "System Administration", marks: 8 }
    ],
    "Embedded System": [
      { id: 1, name: "Introduction to ES", marks: 4 },
      { id: 2, name: "Hardware Design Issues", marks: 8 },
      { id: 3, name: "Software Design Issues", marks: 8 },
      { id: 4, name: "Memory", marks: 8 },
      { id: 5, name: "Interfacing", marks: 8 },
      { id: 6, name: "RTOS", marks: 12 },
      { id: 7, name: "Control System", marks: 8 },
      { id: 8, name: "IC Technology", marks: 8 },
      { id: 9, name: "Microcontrollers in ES", marks: 8 },
      { id: 10, name: "VHDL", marks: 8 }
    ],
    "Database Management System": [
      { id: 1, name: "Introduction", marks: 4 },
      { id: 2, name: "Data Models", marks: 12 },
      { id: 3, name: "Relational Languages & Relational Model", marks: 12 },
      { id: 4, name: "Database Constraints & Normalization", marks: 12 },
      { id: 5, name: "Query Processing and Optimization", marks: 8 },
      { id: 6, name: "File Structure & Hashing", marks: 8 },
      { id: 7, name: "Transactions processing & Concurrency Control", marks: 12 },
      { id: 8, name: "Crash Recovery", marks: 6 },
      { id: 9, name: "Advanced database Concepts", marks: 6 }
    ],
    "Artificial Intelligence": [
      { id: 1, name: "Introduction", marks: 7 },
      { id: 2, name: "Problem Solving", marks: 7 },
      { id: 3, name: "Search techniques", marks: 9 },
      { id: 4, name: "Knowledge representation, inference", marks: 14 },
      { id: 5, name: "Structured Knowledge Representation", marks: 7 },
      { id: 6, name: "Machine Learning", marks: 10 },
      { id: 7, name: "Applications of AI", marks: 26 }
    ],
    "Engineering Economics": [
      { id: 1, name: "Introduction", marks: 4 },
      { id: 2, name: "Cost Concepts & Behavior", marks: 8 },
      { id: 3, name: "Understanding Financial Statements", marks: 16 },
      { id: 4, name: "Comparative Analysis of Alternatives", marks: 12 },
      { id: 5, name: "Replacement Analysis", marks: 12 },
      { id: 6, name: "Risk Analysis", marks: 12 },
      { id: 7, name: "Depreciation & Corporate Income Tax", marks: 12 },
      { id: 8, name: "Inflation", marks: 4 }
    ],
    "Object Oriented Analysis and Design": [
      { id: 1, name: "Object Oriented Fundamentals", marks: 18 },
      { id: 2, name: "Object Oriented Analysis", marks: 14 },
      { id: 3, name: "Object Oriented Design", marks: 21 },
      { id: 4, name: "Implementation", marks: 27 }
    ]
  };

  // Initialize subjects with chapters
  const initializeSubjects = () => {
    return subjectsData.map(subject => {
      const chapters = coursesData[subject.name] || [];
      
      return {
        ...subject,
        chapters: chapters.map(chapter => ({
          id: `${subject.id}-${chapter.id}`,
          title: chapter.name,
          marks: chapter.marks,
          completed: false
        }))
      };
    }).sort((a, b) => calculateDaysUntil(a.examDate) - calculateDaysUntil(b.examDate));
  };

  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);

  // Calculate days until exam
  const calculateDaysUntil = (dateStr) => {
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const parts = dateStr.replace('st', '').replace('nd', '').replace('rd', '').replace('th', '').split(' ');
    const month = months[parts[0]];
    const day = parseInt(parts[1]);
    
    const examDate = new Date(2025, month, day);
    const today = new Date();
    
    // Reset time portion for accurate day calculation
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);
    
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get urgency class based on days
  const getUrgencyClass = (days) => {
    if (days < 0) return '';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'approaching';
    return 'comfortable';
  };

  // Calculate total marks for a subject
  const calculateTotalMarks = (subjectName) => {
    const chapters = coursesData[subjectName] || [];
    return chapters.reduce((total, chapter) => {
      return total + (chapter.marks || 0);
    }, 0);
  };

  // Calculate progress for a subject
  const calculateProgress = (subject) => {
    if (!subject || subject.chapters.length === 0) return 0;
    
    // Check if chapters have marks assigned
    const hasMarks = subject.chapters.some(ch => ch.marks);
    
    if (hasMarks) {
      // Calculate progress based on marks
      const totalMarks = subject.chapters.reduce((sum, ch) => sum + (ch.marks || 0), 0);
      const completedMarks = subject.chapters
        .filter(ch => ch.completed)
        .reduce((sum, ch) => sum + (ch.marks || 0), 0);
          
      return totalMarks > 0 ? (completedMarks / totalMarks) * 100 : 0;
    } else {
      // Calculate progress based on number of chapters
      const completedCount = subject.chapters.filter(ch => ch.completed).length;
      return (completedCount / subject.chapters.length) * 100;
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (subjectId, chapterId) => {
    setSubjects(prevSubjects => {
      const updatedSubjects = prevSubjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            chapters: subject.chapters.map(chapter => {
              if (chapter.id === `${subjectId}-${chapterId}`) {
                return { ...chapter, completed: !chapter.completed };
              }
              return chapter;
            })
          };
        }
        return subject;
      });
      
      // Save to local storage
      saveProgress(updatedSubjects);
      return updatedSubjects;
    });
  };

  // Toggle chapters visibility
  const toggleChapters = (subjectId) => {
    setActiveSubject(activeSubject === subjectId ? null : subjectId);
  };

  // Save progress to local storage
  const saveProgress = (subjectsToSave) => {
    const data = subjectsToSave.map(subject => ({
      id: subject.id,
      chapters: subject.chapters.map(ch => ({
        id: ch.id,
        completed: ch.completed
      }))
    }));
    
    localStorage.setItem('studyPlannerProgress', JSON.stringify(data));
  };

  // Load progress from local storage
  const loadProgress = () => {
    const savedData = localStorage.getItem('studyPlannerProgress');
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      
      setSubjects(prevSubjects => {
        return prevSubjects.map(subject => {
          const savedSubject = data.find(s => s.id === subject.id);
          if (!savedSubject) return subject;
          
          return {
            ...subject,
            chapters: subject.chapters.map(chapter => {
              const savedChapter = savedSubject.chapters.find(ch => ch.id === chapter.id);
              if (savedChapter) {
                return { ...chapter, completed: savedChapter.completed };
              }
              return chapter;
            })
          };
        });
      });
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }
  };

  // JavaScript for independent card expansion
document.addEventListener('DOMContentLoaded', function() {
  const subjectHeaders = document.querySelectorAll('.subject-header');
  
  subjectHeaders.forEach(header => {
      header.addEventListener('click', function() {
          // Toggle active class on the parent card only
          const parentCard = this.closest('.subject-card');
          parentCard.classList.toggle('active');
          
          // Update progress bar animation
          const progressBar = parentCard.querySelector('.progress-bar');
          if (progressBar) {
              // Get the progress value from a data attribute or calculate it
              const chaptersTotal = parentCard.querySelectorAll('.chapter-checkbox').length;
              const chaptersCompleted = parentCard.querySelectorAll('.chapter-checkbox:checked').length;
              const progressValue = chaptersTotal > 0 ? (chaptersCompleted / chaptersTotal) * 100 : 0;
              
              // Set the width with a slight delay for animation effect
              setTimeout(() => {
                  progressBar.style.width = progressValue + '%';
              }, 100);
          }
      });
  });
  
  // Handle checkbox changes to update progress bars
  const chapterCheckboxes = document.querySelectorAll('.chapter-checkbox');
  chapterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          const parentCard = this.closest('.subject-card');
          const chapterItem = this.closest('.chapter-item');
          
          if (this.checked) {
              chapterItem.classList.add('completed-animation');
              setTimeout(() => {
                  chapterItem.classList.remove('completed-animation');
              }, 500);
          }
          
          // Update progress bar
          const chaptersTotal = parentCard.querySelectorAll('.chapter-checkbox').length;
          const chaptersCompleted = parentCard.querySelectorAll('.chapter-checkbox:checked').length;
          const progressValue = (chaptersCompleted / chaptersTotal) * 100;
          
          const progressBar = parentCard.querySelector('.progress-bar');
          progressBar.style.width = progressValue + '%';
      });
  });
});


  // Initialize on component mount
  useEffect(() => {
    setSubjects(initializeSubjects());
  }, []);

  // Load saved progress after subjects are initialized
  useEffect(() => {
    if (subjects.length > 0) {
      loadProgress();
    }
  }, [subjects.length]);

  return (
    <div className="study-planner">
      <div className="subjects-container">
        {subjects.map((subject, index) => {
          const daysUntil = calculateDaysUntil(subject.examDate);
          const urgencyClass = getUrgencyClass(daysUntil);
          const totalMarks = calculateTotalMarks(subject.name);
          const marksDisplay = totalMarks ? ` (${totalMarks} marks)` : '';
          const progress = calculateProgress(subject);
          const isActive = activeSubject === subject.id;
          
          return (
            <div 
              key={subject.id} 
              className={`subject-card ${urgencyClass}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={`subject-header ${isActive ? 'active' : ''}`}
                onClick={() => toggleChapters(subject.id)}
              >
                <div className="subject-title">
                  {subject.name}{marksDisplay}
                </div>
                <div className="exam-date">{subject.examDate}</div>
                <div className="collapse-icon"></div>
              </div>
              
              <div className="days-left">
                {daysUntil < 0 ? (
                  <span>Exam completed</span>
                ) : daysUntil === 0 ? (
                  <>
                    <span className="timer-icon"></span>
                    <span>Exam is today!</span>
                  </>
                ) : (
                  <>
                    <span className="timer-icon"></span>
                    <span>{daysUntil} days left</span>
                  </>
                )}
              </div>
              
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div 
                className="chapters-container"
                style={{ 
                  maxHeight: isActive ? '1000px' : '0',
                  transition: 'max-height 0.3s ease-in-out'
                }}
              >
                <div className="chapters-list">
                  {subject.chapters.length === 0 ? (
                    <div className="placeholder-text">
                      Chapters will be added soon. Check back later!
                    </div>
                  ) : (
                    subject.chapters.map(chapter => {
                      const chapterId = chapter.id.split('-')[1];
                      const marksInfo = chapter.marks ? 
                        <span className="chapter-marks">({chapter.marks} marks)</span> : 
                        null;
                      
                      return (
                        <div key={chapter.id} className="chapter-item">
                          <input 
                            type="checkbox" 
                            id={chapter.id} 
                            className="chapter-checkbox"
                            checked={chapter.completed}
                            onChange={() => handleCheckboxChange(subject.id, chapterId)}
                          />
                          <label htmlFor={chapter.id} className="chapter-label">
                            {chapter.title} {marksInfo}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer">
  <p className="footer-title">Study Planner</p>
  <p>Created by <a 
    href="https://github.com/AlsoAbhinav" 
    target="_blank" 
    rel="noopener noreferrer"
    className="footer-link"
  >Abhinav</a></p>
</div>
 
    </div>
  );
};

export default StudyPlanner;