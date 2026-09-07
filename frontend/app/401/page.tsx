import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorScreen } from "@/components/error-screen"

export default function UnauthorizedPage() {
  return (
    <ErrorScreen
      code="401"
      title="認証が必要です"
      description="このページを表示するにはログインが必要です。ログインしてからもう一度お試しください。"
      icon={<Lock className="h-8 w-8 text-primary sm:h-10 sm:w-10" />}
      action={
        <Link href="/employee/login" className="w-full sm:w-auto">
          <Button size="lg" className="w-full">
            ログインする
          </Button>
        </Link>
      }
    />
  )
}
