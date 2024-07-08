import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/ProviderAuth'

export default function () {
  const { authClient } = useAuth()
  const { data } = useQuery({
    queryKey: ['getAdmins'],
    queryFn: async () => {
      return authClient?.admin.getAdmins({ page: 1, limit: 10 })
    },
  })

  if (!data) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((i: any) => (
                <TableRow key={i.id}>
                  <TableCell>{i.id}</TableCell>
                  <TableCell>{i.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{data.length}</strong> of <strong>{data.length}</strong> admins
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
