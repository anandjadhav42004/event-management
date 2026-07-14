import React, { useState } from 'react';
import { useGetUsers } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading } = useGetUsers({ search: searchTerm });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary/20 text-primary border-primary/20';
      case 'organizer': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'vendor': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'client': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">System Users</h1>
        <p className="text-muted-foreground">Manage access across the platform.</p>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur">
        <div className="p-4 border-b border-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-background/50 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : users?.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No users found.</TableCell></TableRow>
              ) : (
                users?.map((user) => (
                  <TableRow key={user.id} className="border-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-white/5 text-xs">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-destructive/20 text-destructive border-destructive/20'}`}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
