import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Option {
  text: string
  isCorrect: boolean
}

interface Question {
  questionText: string
  questionType: string
  timeLimit: number
  options: Option[]
  image?: File | null
  imagePreview?: string | null
}

export default function CreateQuiz() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: '',
      questionType: 'multiple_choice',
      timeLimit: 30,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      image: null,
      imagePreview: null,
    },
  ])
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a quiz',
        variant: 'destructive',
      })
      navigate('/auth')
    }
  }, [user, authLoading, navigate, toast])

  if (authLoading || !user) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'multiple_choice',
        timeLimit: 30,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
        image: null,
        imagePreview: null,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value,
    }
    setQuestions(updated)
  }

  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optionIndex
    })
    setQuestions(updated)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a quiz title',
        variant: 'destructive',
      })
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) {
        toast({
          title: 'Error',
          description: `Please enter question text for question ${i + 1}`,
          variant: 'destructive',
        })
        return
      }

      const hasCorrectAnswer = q.options.some((opt) => opt.isCorrect)
      if (!hasCorrectAnswer) {
        toast({
          title: 'Error',
          description: `Please select a correct answer for question ${i + 1}`,
          variant: 'destructive',
        })
        return
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          toast({
            title: 'Error',
            description: `Please fill all options for question ${i + 1}`,
            variant: 'destructive',
          })
          return
        }
      }
    }

    try {
      // Convert images to base64
      let quizImageBase64 = null
      if (image) {
        try {
          quizImageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              if (reader.result) {
                resolve(reader.result as string)
              } else {
                reject(new Error('Failed to read quiz image'))
              }
            }
            reader.onerror = () => reject(new Error('Error reading quiz image file'))
            reader.readAsDataURL(image)
          })
        } catch (imageError) {
          console.error('Error converting quiz image:', imageError)
          toast({
            title: 'Warning',
            description: 'Failed to convert quiz image. Continuing without image.',
            variant: 'destructive',
          })
        }
      }

      const questionsWithImages = await Promise.all(
        questions.map(async (q) => {
          let questionImageBase64 = null
          if (q.image) {
            try {
              questionImageBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                  if (reader.result) {
                    resolve(reader.result as string)
                  } else {
                    reject(new Error('Failed to read question image'))
                  }
                }
                reader.onerror = () => reject(new Error('Error reading question image file'))
                reader.readAsDataURL(q.image!)
              })
            } catch (imageError) {
              console.error('Error converting question image:', imageError)
              // Continue without image for this question
            }
          }
          return {
            questionText: q.questionText,
            questionType: q.questionType,
            timeLimit: q.timeLimit,
            options: q.options,
            image: questionImageBase64,
          }
        })
      )

      await axios.post('http://localhost:5000/api/quiz', {
        title,
        description,
        image: quizImageBase64,
        questions: questionsWithImages,
        isPublic,
      })
      toast({
        title: 'Success',
        description: 'Quiz created successfully!',
      })
      navigate('/')
    } catch (error: any) {
      console.error('Error creating quiz:', error)
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to create a quiz',
          variant: 'destructive',
        })
        navigate('/auth')
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to create quiz'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    }
  }

  const getOptionClasses = (optionIndex: number, isCorrect: boolean) => {
    const colorClasses = [
      { correct: 'bg-red-500 text-white border-white', incorrect: 'bg-gray-50 border-red-500' },
      { correct: 'bg-blue-500 text-white border-white', incorrect: 'bg-gray-50 border-blue-500' },
      { correct: 'bg-yellow-500 text-white border-white', incorrect: 'bg-gray-50 border-yellow-500' },
      { correct: 'bg-green-500 text-white border-white', incorrect: 'bg-gray-50 border-green-500' },
    ]
    const colors = colorClasses[optionIndex] || colorClasses[0]
    return isCorrect ? colors.correct : colors.incorrect
  }

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive',
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleQuestionImageSelect = (questionIndex: number, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updated = [...questions]
        updated[questionIndex] = {
          ...updated[questionIndex],
          image: file,
          imagePreview: reader.result as string,
        }
        setQuestions(updated)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive',
      })
    }
  }

  const handleQuestionImageDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleQuestionImageDrop = (e: React.DragEvent, questionIndex: number) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleQuestionImageSelect(questionIndex, file)
    }
  }

  const handleQuestionFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      handleQuestionImageSelect(questionIndex, file)
    }
  }

  const removeQuestionImage = (questionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex] = {
      ...updated[questionIndex],
      image: null,
      imagePreview: null,
    }
    setQuestions(updated)
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-white/90 hover:bg-white hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Back to Home
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur mb-6 shadow-2xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New Quiz
            </CardTitle>
            <CardDescription>Build an interactive quiz for your audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Quiz Visibility</Label>
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    isPublic
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    !isPublic
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Private
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isPublic
                  ? 'Public quizzes show access codes in the Available Quizzes section'
                  : 'Private quizzes hide access codes - only you can see them'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Quiz Image (Optional)</Label>
              {!imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Drag and drop an image here, or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-500 hover:text-blue-600 underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <img
                      src={imagePreview}
                      alt="Quiz preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {questions.map((question, questionIndex) => (
          <Card key={questionIndex} className="bg-white/95 backdrop-blur mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Question {questionIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text</Label>
                <Input
                  placeholder="Enter your question"
                  value={question.questionText}
                  onChange={(e) =>
                    updateQuestion(questionIndex, 'questionText', e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Limit (seconds)</Label>
                  <Input
                    type="number"
                    value={question.timeLimit}
                    onChange={(e) =>
                      updateQuestion(questionIndex, 'timeLimit', parseInt(e.target.value) || 30)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Question Image (Optional)</Label>
                {!question.imagePreview ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-gray-400"
                    onDragOver={handleQuestionImageDragOver}
                    onDrop={(e) => handleQuestionImageDrop(e, questionIndex)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionFileInputChange(e, questionIndex)}
                      className="hidden"
                      id={`question-image-${questionIndex}`}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Drag and drop an image here, or{' '}
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`question-image-${questionIndex}`) as HTMLInputElement
                              input?.click()
                            }}
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <img
                        src={question.imagePreview}
                        alt="Question preview"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeQuestionImage(questionIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <Label>Answer Options</Label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2 items-center">
                    <div
                      className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${getOptionClasses(optionIndex, option.isCorrect)}`}
                      onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          Option {optionIndex + 1} {option.isCorrect && '✓'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCorrectAnswer(questionIndex, optionIndex)
                          }}
                        >
                          {option.isCorrect ? 'Correct' : 'Mark as Correct'}
                        </Button>
                      </div>
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          updateOption(questionIndex, optionIndex, 'text', e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={option.isCorrect ? 'bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-70' : ''}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4 mb-6">
          <Button onClick={addQuestion} variant="outline" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 text-lg h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Create Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}

