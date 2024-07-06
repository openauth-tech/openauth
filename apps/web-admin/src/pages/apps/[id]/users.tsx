import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserDetailDialog } from '@/components/user/UserDetailDialog'
import { useHttpClient } from '@/hooks/useHttpClient'
import { UserDetail } from '@/models/user'

export default function () {
  const { id: appId } = useParams()
  const http = useHttpClient()
  const [selectedUser, setSelectedUser] = useState<any>()
  const [page, setPage] = useState<number>(1)
  const limit = 10

  // TODO: use data table
  const { data } = useQuery<UserDetail[]>({
    queryKey: ['getUsers', appId, page, limit],
    queryFn: () => http.get(`/admin/users?appId=${appId}&page=${page}&limit=${limit}`).then((res: any) => res.data),
  })

  return (
    <AppContainer>
      <AppHeader title="User snapshot" />

      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card>
          <CardContent className="py-3 px-4">
            <div className="">Active users</div>
            <div className="text-lg font-bold">{data?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="">New users</div>
            <div className="text-lg font-bold">{data?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="">Total users</div>
            <div className="text-lg font-bold">{data?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Linked accounts</TableHead>
                <TableHead>Registered at</TableHead>
                <TableHead>Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((i) => (
                <TableRow key={i.id} onClick={() => setSelectedUser(i)} className="cursor-pointer">
                  <TableCell>{i.id}</TableCell>
                  <TableCell>{i.id}</TableCell>
                  <TableCell>{i.id}</TableCell>
                  <TableCell>{i.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <UserDetailDialog user={selectedUser} onClose={() => setSelectedUser(undefined)} />
    </AppContainer>
  )
}