import EditQuiz from '@/pages/EditQuiz'

export default function EditQuizPage({ params }: { params: { id: string } }) {
  return <EditQuiz id={params.id} />
}

