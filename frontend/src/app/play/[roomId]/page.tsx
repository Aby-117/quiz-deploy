import PlayerView from '@/pages/PlayerView'

export default function PlayerViewPage({ params }: { params: { roomId: string } }) {
  return <PlayerView roomId={params.roomId} />
}

