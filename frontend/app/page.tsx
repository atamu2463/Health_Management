import Link from "next/link"
import { Heart, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TopPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
              <Heart className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
              HealthBridge
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty sm:text-base">
              毎日の体調を記録し、健康状態を可視化。
              <br />
              安心して働ける職場づくりをサポートします。
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Link href="/employee/login" className="w-full">
              <Button className="w-full gap-2 py-5 text-sm sm:py-6 sm:text-base" size="lg">
                <Users className="h-5 w-5" />
                従業員ログイン
              </Button>
            </Link>
            <Link href="/admin/login" className="w-full">
              <Button variant="outline" className="w-full gap-2 py-5 text-sm sm:py-6 sm:text-base" size="lg">
                <Shield className="h-5 w-5" />
                管理者ログイン
              </Button>
            </Link>
          </div>

          <div className="flex w-full flex-col items-center gap-2 border-t border-border pt-5 sm:pt-6">
            <p className="text-xs text-muted-foreground sm:text-sm">
              組織がまだ登録されていませんか？
            </p>
            <Link href="/organization/register">
              <Button variant="link" className="text-primary text-sm">
                新規組織登録はこちら
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
