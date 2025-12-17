"use client"

import { useEffect, useState } from "react"
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconBuilding,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api from "@/lib/api"

type Recap = {
  tepatWaktu: number
  telat: number
  totalUser: number
  totalDivisi: number
}

export function SectionCards() {
  const [data, setData] = useState<Recap>({
    tepatWaktu: 0,
    telat: 0,
    totalUser: 0,
    totalDivisi: 0,
  })

  useEffect(() => {
    const fetchRecap = async () => {
      try {
        const res = await api.get("/api/attendance/recap")
        setData(res.data.data)
      } catch (error) {
        console.error("Gagal mengambil rekap presensi", error)
      }
    }

    fetchRecap()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">

      {/* TEPAT WAKTU */}
      <Card>
        <CardHeader>
          <CardDescription>Tepat Waktu</CardDescription>
          <CardTitle className="text-3xl font-bold text-green-600">
            {data.tepatWaktu}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="size-4" />
              ONTIME
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Karyawan hadir tepat waktu
        </CardFooter>
      </Card>

      {/* TERLAMBAT */}
      <Card>
        <CardHeader>
          <CardDescription>Terlambat</CardDescription>
          <CardTitle className="text-3xl font-bold text-orange-500">
            {data.telat}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-500">
              <IconTrendingDown className="size-4" />
              LATE
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Hadir melewati jam masuk
        </CardFooter>
      </Card>

      {/* TOTAL DIVISI */}
      <Card>
        <CardHeader>
          <CardDescription>Total Divisi Aktif</CardDescription>
          <CardTitle className="text-3xl font-bold text-blue-600">
            {data.totalDivisi}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <IconBuilding className="size-4" />
              DIVISI
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Divisi dengan status aktif
        </CardFooter>
      </Card>

      {/* TOTAL KARYAWAN */}
      <Card>
        <CardHeader>
          <CardDescription>Total Karyawan</CardDescription>
          <CardTitle className="text-3xl font-bold">
            {data.totalUser}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
              AKTIF
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Karyawan aktif terdaftar
        </CardFooter>
      </Card>

    </div>
  )
}
