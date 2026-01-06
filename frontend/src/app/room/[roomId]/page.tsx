import QuizRoom from '@/pages/QuizRoom'

export default function QuizRoomPage({ params }: { params: { roomId: string } }) {
  return <QuizRoom roomId={params.roomId} />
}

