import FindNearYou from './_components/find-near-you'
import HowItWork from '@/components/HowItWork'

export default function FindNearYouLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-white py-[100px] pb-24">
            {/* 
        This is the core search state and UI component.
        By placing it in a layout, it stays MOUNTED when switching between
        /find-near-you (List) and /find-near-you/map (Map).
      */}
            <FindNearYou />

            {/* Pages will render their specific content here */}
            {children}

            <div className="py-20 border-t border-gray-100">
                <HowItWork />
            </div>
        </main>
    )
}
