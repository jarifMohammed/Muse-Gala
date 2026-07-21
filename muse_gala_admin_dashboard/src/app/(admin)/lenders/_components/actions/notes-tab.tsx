import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface Props {
  lenderId: string
}

const NotesTab = ({}: Props) => {
  const [note, setNote] = useState('')
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: string; text: string; date: string }>
  >([])

  const handleSaveNote = () => {
    if (note.trim()) {
      const newNote = {
        id: Date.now().toString(),
        text: note,
        date: new Date().toLocaleString(),
      }
      setSavedNotes([newNote, ...savedNotes])
      setNote('')
    }
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Add a note about this lender..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button onClick={handleSaveNote} disabled={!note.trim()}>
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {savedNotes.length > 0 && (
        <Card className="shadow-none rounded-[6px] w-full">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Previous Notes</h3>
            <div className="space-y-3">
              {savedNotes.map(savedNote => (
                <div
                  key={savedNote.id}
                  className="border-b pb-3 last:border-b-0"
                >
                  <p className="text-sm text-gray-600 mb-1">{savedNote.date}</p>
                  <p className="text-sm">{savedNote.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default NotesTab
