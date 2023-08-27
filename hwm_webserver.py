#!/bin/python3

import json
import mariadb
import sys
import os
import mimetypes
import urllib
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

sql_username = "username"
sql_password = "password"
sql_host = "::1"
sql_port = 3306
sql_database_name = "hwm"
sql_table_name = "items"

# Connect to MariaDB Platform
try:
    conn = mariadb.connect(
        user=sql_username,
        password=sql_password,
        host=sql_host,
        port=sql_port,
        database=sql_database_name
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

class MyServer(SimpleHTTPRequestHandler):
    path = "/home/jonny/webserver/"
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    def do_GET(self):
        if (self.path.startswith('/list')):
            cur = conn.cursor(dictionary=True)
            table_name_sql = conn.escape_string(sql_table_name)
            cur.execute("SELECT * FROM " + table_name_sql)
            result = cur.fetchall()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif (self.path.startswith('/itemlist.json')):
            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            # message = "Hello, World! Here is a POST response"
            # my_query = query_db("select * from items")
            cur = conn.cursor()
            cur.execute("select * from items")
            r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
            my_query = (r[0] if r else None) if False else r
            self.wfile.write(bytes(json.dumps(my_query), "utf8"))
            conn.commit()
        elif (self.path.startswith('/query?')):
            print("Query Operation")
            searchterm = ''
            query_components = parse_qs(urlparse(self.path).query)
            print("Query: ", query_components)
            cur = conn.cursor(dictionary=True)
            table_name_sql = conn.escape_string(sql_table_name)
            if "search" in query_components:
                print("Search keywords: ", query_components["search"])
                for word in query_components["search"]:
                    print("Keyword: ", word)
                    searchterm = "%" + word + "%"
                    cur.execute("SELECT * FROM " + table_name_sql + " WHERE name_en LIKE ? OR name_de LIKE ? or serial LIKE ?", (searchterm, searchterm, searchterm))
            elif "itemid" in query_components:
                itemid_int = int(query_components["itemid"][0])
                print("Itemid: ", itemid_int)
                cur.execute("SELECT * FROM " + table_name_sql + " WHERE itemid = ?", (itemid_int,))
            else:
                print("No valid search queries")
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write("No valid search queries received".encode("utf-8"))
                return
            result = cur.fetchall()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif (self.path.startswith('/insert')):
            print("Insert operation")
            query_components = parse_qs(urlparse(self.path).query)
            print("Insert operation contents: ", query_components)
            cur = conn.cursor(dictionary=True)
            table_name_sql = conn.escape_string(sql_table_name)
            if "itemid" in query_components and "name_en" in query_components and "active" in query_components:
                itemid_int = int(query_components["itemid"][0])
                print("Inserting itemid=", itemid_int, ",name_en=", query_components["name_en"][0], ",active=", query_components["active"][0])
                try:
                    cur.execute("INSERT INTO " + table_name_sql + " (itemid,name_en,active) VALUES (?, ?, ?)", (itemid_int, query_components["name_en"][0], query_components["active"][0]))
                    self.send_response(200)
                    self.send_header("Content-type", "text/html")
                    self.end_headers()
                    self.wfile.write("Insert operation completed".encode("utf-8"))
                    print("Insert completed")
                except mariadb.Error as e:
                    print(f"MariDB Error: {e}")
                    self.send_response(200)
                    self.send_header("Content-type", "text/html")
                    self.end_headers()
                    error_string = "MariaDB Error: " + str(e)
                    self.wfile.write(error_string.encode("utf-8"))
            else:
                print("Insert operation: Parameters incomplete")
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write("Insert: Parameters incomplete".encode("utf-8"))
        else:
            filepath = self.path.lstrip("/")
            print("Filepath: ", filepath)
            if(filepath[-1] == "/"):
                filepath = filepath + "index.htm"
            try:
                f = open(os.path.join("/home/jonny/webserver2/", filepath), "rb")
            except IOError:
                self.send_error(404,'File Not Found: %s ' % filepath)
            else:
                mimetype, _ = mimetypes.guess_type(filepath)
                # print("Mimetype: ", mimetype)
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header('Content-type', mimetype)
                self.end_headers()
                for s in f:
                    self.wfile.write(s)
    def do_POST(self):
        #self.send_response(200)
        #self.send_header('Content-type','application/json')
        #self.send_header('Access-Control-Allow-Origin', '*')
        #self.end_headers()
        #cur = conn.cursor()
        #cur.execute("select * from items")
        print("POST request received")
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(int(content_length))
        print("URLLib Parse:")
        parsed_data = urllib.parse.parse_qs(post_data)
        parsed_item_name = parsed_data['item_name'.encode('utf-8')][0].decode('utf-8')
        print(parsed_data)
        print("Item Name: ", parsed_item_name)
        parsed_location = int(parsed_data['item_location'.encode('utf-8')][0].decode('utf-8'))
        print("Location: ", parsed_location)
        if parsed_item_name and parsed_location:
            try:
                cur = conn.cursor(dictionary=True)
                table_name_sql = conn.escape_string(sql_table_name)
                cur.execute("INSERT INTO " + table_name_sql + " (name_en,name_de,location) VALUES (?, ?, ?)", (parsed_item_name, parsed_item_name, parsed_location))
                conn.commit()
            except Exception as ex:
                print("ERROR:", ex)
                self.send_error(400, "Bad Content")
        self.send_response(200)
        self.wfile.write("ok".encode('utf-8'))

if __name__ == "__main__":        
    webServer = HTTPServer(('', 3002), MyServer)
    print("Server started")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")

conn.close()

