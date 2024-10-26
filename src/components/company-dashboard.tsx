'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ArrowUpDown } from "lucide-react"

type Company = {
  id: number
  name: string
  corporateNumber: string
  address: string
}

type SortField = 'name' | 'corporateNumber' | 'address'

export default function CompanyDashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState({ name: '', corporateNumber: '', address: '' })
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('https://api.example.com/companies')
        if (!response.ok) {
          throw new Error('データの取得に失敗しました')
        }
        const data: Company[] = await response.json()
        setCompanies(data)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        setError('会社情報の取得中にエラーが発生しました')
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const handleFilterChange = (field: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedCompanies = companies
    .filter(company =>
      company.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      company.corporateNumber.includes(filters.corporateNumber) &&
      company.address.toLowerCase().includes(filters.address.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  if (isLoading) {
    return <div className="text-center mt-8">データを読み込んでいます...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">会社情報ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="会社名でフィルタ"
          value={filters.name}
          onChange={handleFilterChange('name')}
          aria-label="会社名でフィルタ"
        />
        <Input
          placeholder="法人番号でフィルタ"
          value={filters.corporateNumber}
          onChange={handleFilterChange('corporateNumber')}
          aria-label="法人番号でフィルタ"
        />
        <Input
          placeholder="住所でフィルタ"
          value={filters.address}
          onChange={handleFilterChange('address')}
          aria-label="住所でフィルタ"
        />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')} className="font-bold">
                  会社名 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('corporateNumber')} className="font-bold">
                  法人番号 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('address')} className="font-bold">
                  住所 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCompanies.map(company => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.corporateNumber}</TableCell>
                <TableCell>{company.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredAndSortedCompanies.length === 0 && (
        <p className="text-center mt-4 text-muted-foreground">該当する会社が見つかりません。</p>
      )}
    </div>
  )
}