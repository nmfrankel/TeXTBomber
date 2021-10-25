## API Reference
All of the back-ends endpoints explained.

### Endpoints
**`/sendMsg/` `POST`**  
Send a sms message to a phone.
```json
{
	"mailto": "String: phone number or email with gateway",
	"body": "String: Message body (Max: 140 char)"
}
```

**`/blockIP/{ip}/` `GET`**  
See the status if an {IP address} is currently blocked. No data gets sent

**`/blockIP/` `POST`**  
Add the clients IP address to the blocked list. No data gets sent

Last updated: __10/25/21__