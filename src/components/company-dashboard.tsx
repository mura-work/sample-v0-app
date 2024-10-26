import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

type Company = {
  id: number
  name: string
  corporateNumber: string
  address: string
}

const initialCompanies: Company[] = [
  { id: 1, name: "株式会社A", corporateNumber: "1234567890123", address: "東京都千代田区" },
  { id: 2, name: "株式会社B", corporateNumber: "2345678901234", address: "大阪府大阪市" },
  { id: 3, name: "株式会社C", corporateNumber: "3456789012345", address: "愛知県名古屋市" },
  { id: 4, name: "株式会社D", corporateNumber: "4567890123456", address: "福岡県福岡市" },
  { id: 5, name: "株式会社E", corporateNumber: "5678901234567", address: "北海道札幌市" },
]

type SortField = 'name' | 'corporateNumber' | 'address'

export function CompanyDashboardComponent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState({ name: '', corporateNumber: '', address: '' })
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    setCompanies(initialCompanies)
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">会社情報ダッシュボード</h1>
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')}>
                  会社名 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('corporateNumber')}>
                  法人番号 <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('address')}>
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
    </div>
  )
}