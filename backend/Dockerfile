FROM golang:1.26.5-alpine

WORKDIR /backend

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8080

CMD ["go", "run", "."]
