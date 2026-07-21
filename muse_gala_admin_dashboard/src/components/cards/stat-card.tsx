import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  title: string
  value: string
}

export const InfoCard = ({ title, value }: Props) => {
  return (
    <Card
      className={
        'hover:bg-black hover:text-white hover:scale-105 transition-all duration-500 ease-in-out'
      }
    >
      <CardHeader>
        <CardTitle className="font-normal leading-[120%]">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <CardFooter>
          <h1 className="text-[25px]">{value}</h1>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
