const app = Vue.createApp({
  data() {
    return {
      currentPage: 'guesthousesIndex',
      searchText: '',
      allGuesthouses: [],
      guesthouse: new Object(),
      allRooms: [],
      room: '',
      validateForm: false,
      startDate: '',
      finishDate: '',
      guestsNumber: '',
      totalPrice: '',
      errors: []
    }
  },

  computed: {
    listResult() {
      if (this.searchText.length > 0) {
        return this.allGuesthouses.filter(guesthouse => {
          return guesthouse.tradingName.toLowerCase().includes(this.searchText.toLowerCase())
        })
      } else {
        return this.allGuesthouses
      }
    }
  },

  async mounted() {
    this.listResult = await this.getAllGuesthouses()
  },

  methods: {
    async getAllGuesthouses() {
      this.currentPage = 'guesthousesIndex'

      const response = await fetch('http://localhost:3000/api/v1/guesthouses')
      const data = await response.json()

      this.allGuesthouses = []

      data.forEach(item => {
        const guesthouse = new Object()

        guesthouse.id = item.id
        guesthouse.tradingName = item.trading_name
        guesthouse.city = item.address.city

        this.allGuesthouses.push(guesthouse)
      })
    },

    async getGuesthouseDetails(guesthouseId) {
      this.currentPage = 'guesthouseDetails'

      const response = await fetch(`http://localhost:3000/api/v1/guesthouses/${guesthouseId}`)
      const data = await response.json()

      this.guesthouse.id = data.id
      this.guesthouse.tradingName = data.trading_name
      this.guesthouse.description = data.description
      this.guesthouse.allowPets = data.allow_pets ? 'Sim' : 'Não'
      this.guesthouse.usagePolicy = data.usage_policy
      this.guesthouse.checkIn = data.check_in
      this.guesthouse.checkOut = data.check_out
      this.guesthouse.paymentMethods = data.payment_methods
      this.guesthouse.averageRating = data.average_rating
      this.guesthouse.streetName = data.address.street_name
      this.guesthouse.streetNumber = data.address.street_number
      this.guesthouse.complement = data.address.complement
      this.guesthouse.district = data.address.district
      this.guesthouse.city = data.address.city
      this.guesthouse.state = data.address.state
      this.guesthouse.postalCode = data.address.postal_code
      this.guesthouse.phone = data.contact.phone
      this.guesthouse.email = data.contact.email

      this.getAllRooms(guesthouseId)
    },

    async getAllRooms(guesthouseId) {
      const response = await fetch(`http://localhost:3000/api/v1/guesthouses/${guesthouseId}/rooms`)
      const data = await response.json()

      data.forEach(item => {
        const room = new Object()

        room.id = item.id
        room.name = item.name
        room.description = item.description
        room.area = item.area
        room.dailyRate = item.daily_rate

        this.allRooms.push(room)
      })
    },

    getRoomDetails(index) {
      this.currentPage = 'roomDetails'

      this.room = this.allRooms[index]
      console.log(this.room)
      console.log(this.currentPage)
    },

    async validateBooking(roomId) {
      this.totalPrice = ''
      this.errors = []

      params = `?start_date=${this.startDate}&finish_date=${this.finishDate}&guests_number=${this.guestsNumber}`

      const response = await fetch(`http://localhost:3000/api/v1/rooms/${roomId}/validate-booking/${params}`)
      const data = await response.json()

      console.log(data)

      if (data.total_price) {
        this.totalPrice = data.total_price
      } else {
        this.errors = data.errors
        console.log(data.errors)
      }
    }
  }
})

app.mount('#app')